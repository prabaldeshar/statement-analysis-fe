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

let categoryOptions = ["Food", "Transport", "Shopping", "Entertainment"]
let paymentMethodOptions = ["Cash", "Credit Card", "Debit Card", "UPI"]
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
          <span>{title}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => column.setFilterValue(null)}>All</DropdownMenuItem>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuItem key={option} onClick={() => column.setFilterValue(option)}>
            <Check className={cn("mr-2 h-4 w-4", String(column.getFilterValue()).toLowerCase() === String(option).toLowerCase() ? "opacity-100" : "opacity-0")} />
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
        <div className="px-4 py-2 text-center font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
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

