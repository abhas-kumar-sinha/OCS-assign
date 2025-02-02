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

interface UserTableProps {
  onSignOut: () => void;
}

interface User {
  userid: string;
  password_hash: string;
  role: string;
}

export function UserTable({ onSignOut }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token') ?? '';
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/3j54K1-protected-endpoint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Check if the data is an array or a single object
        if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else if (data.data) {
          setUsers([data.data]);
        } else {
          console.error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
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
              <TableRow key={user.userid}>
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
