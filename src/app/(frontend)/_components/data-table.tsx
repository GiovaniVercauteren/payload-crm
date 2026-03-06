import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

interface DataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
}

export default function DataTable<TData, TValue>({ data, columns }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableHead key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableHead colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableHead>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
