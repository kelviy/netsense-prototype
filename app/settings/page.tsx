"use client";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui";
import { FARM } from "@/lib/mockData";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader className="py-3">
          <CardTitle>Farm</CardTitle>
        </CardHeader>
        <CardBody className="text-sm space-y-1">
          <div><span className="text-muted-foreground">Name: </span>{FARM.name}</div>
          <div><span className="text-muted-foreground">Location: </span>{FARM.location}</div>
          <div><span className="text-muted-foreground">Area: </span>{FARM.hectares} ha</div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className="py-3">
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardBody className="text-sm space-y-1">
          <div><span className="text-muted-foreground">Owner: </span>Janneke du Plessis</div>
          <div><span className="text-muted-foreground">Plan: </span>Grower (self-hosted mesh)</div>
        </CardBody>
      </Card>
    </div>
  );
}
