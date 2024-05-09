"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import IntensityStars from "@/components/intensity-stars";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  size: string;
  origin: string;
  intensity: number;
  stock: number;
  coffeeBrand: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "coffeeBrand",
    header: "CoffeeBrand",
  },
  {
    accessorKey: "origin",
    header: "Origin",
  },
  {
    accessorKey: "intensity",
    header: "Intensity",
    cell: ({ row }) => <IntensityStars intensity={row.original.intensity} />,
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
