"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type User = Database["public"]["Tables"]["users"]["Row"];

interface UserTableProps {
  onSignOut: () => void;
}

export function UserTable({ onSignOut }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("users").select();
      if (data) setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">User Database</h2>
        <p className="text-muted-foreground">
          Showing all registered users and their roles
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">User ID</TableHead>
              <TableHead className="w-[400px]">Password Hash</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.userid}</TableCell>
                <TableCell className="font-mono text-sm">
                  {user.password_hash}
                </TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={onSignOut}>
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}