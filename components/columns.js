"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowDown, ArrowUp, ChevronsUpDown, EyeOff, Check } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

let categoryOptions = []
let paymentMethodOptions = []
let transactionTypeOptions = ["Withdraw", "Deposit"]


fetch("http://localhost:8000/filter-fields/")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error: Status ${response.status}`)
    }
    return response.json()
  })
  .then(data => {
    categoryOptions = data.category
    paymentMethodOptions = data.payment_methods
    console.log("Fetched data: ", data);
  })
  .catch(error => console.log("Error fetching expenses:", error));


function DataTableColumnHeader({ column, title, className }) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function DataTableFilter({ column, title, options }) {
  const currentFilter = column.getFilterValue()
  console.log(`current Filter ${currentFilter}`)
  console.log(`options ${options}`)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
          <span>{title} {currentFilter ? `(${currentFilter})` : ""}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => column.setFilterValue(null)}>
        {currentFilter === undefined && <Check className="mr-2 h-4 w-4 opacity-100" />}
          All
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuItem key={option} onClick={() => column.setFilterValue(option)}>
            {currentFilter === option && <Check className="mr-2 h-4 w-4 opacity-100" />}
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}



export const columns = [
  {
    accessorKey: "transaction_date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableFilter column={column} title="Category" options={categoryOptions} />,
    filterFn: (row, id, value) => {
      return value ? row.getValue(id).toLowerCase() === value.toLowerCase() : true
    },
    cell: ({ row }) => {
      const category = row.getValue("category")
      return (
        <div className="flex items-center justify-start w-full">
          {category}
        </div>
      )
    },
  },
  {
    accessorKey: "payee",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payee" />,
  },
  {
    accessorKey: "type_of_transaction",
    header: ({ column }) => <DataTableFilter column={column} title="Transaction Type" options={transactionTypeOptions} />,
    filterFn: (row, id, value) => {
      return value ? row.getValue(id).toLowerCase() === value.toLowerCase() : true
    },
  },
  {
    accessorKey: "payment_method",
    header: ({ column }) => <DataTableFilter column={column} title="Payment Method" options={paymentMethodOptions} />,
    filterFn: (row, id, value) => {
      return value ? row.getValue(id).toLowerCase() === value.toLowerCase() : true
    },
  },
]

