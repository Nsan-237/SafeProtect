import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";

const incidentsData = [
  { id: 'INC-2024-125', type: 'Sexual Abuse', location: 'Yaoundé, Mfoundi', date: '31 May 2024', status: 'New', assignedTo: '—' },
  { id: 'INC-2024-124', type: 'Domestic Violence', location: 'Douala, Bonamoussadi', date: '30 May 2024', status: 'In Progress', assignedTo: 'A. Ndey' },
  { id: 'INC-2024-123', type: 'Neglect', location: 'Bamenda, Mezam', date: '29 May 2024', status: 'In Progress', assignedTo: 'E. Tchana' },
  { id: 'INC-2024-122', type: 'Physical Abuse', location: 'Bafoussam, Mifi', date: '28 May 2024', status: 'New', assignedTo: '—' },
];

export function RecentIncidents() {
  const getStatusBadge = (status: string) => {
    if (status === 'New') {
      return <Badge className="bg-[#FFE5E9] text-[#FF2E55] hover:bg-[#FFE5E9] border-0 font-bold px-3 py-1 rounded-full">New</Badge>;
    }
    return <Badge className="bg-[#FFF3E0] text-[#E65100] hover:bg-[#FFF3E0] border-0 font-bold px-3 py-1 rounded-full">In Progress</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-100 hover:bg-transparent">
          <TableHead className="font-bold text-[#75759E]">ID</TableHead>
          <TableHead className="font-bold text-[#75759E]">Type</TableHead>
          <TableHead className="font-bold text-[#75759E]">Location</TableHead>
          <TableHead className="font-bold text-[#75759E]">Date</TableHead>
          <TableHead className="font-bold text-[#75759E]">Status</TableHead>
          <TableHead className="font-bold text-[#75759E]">Assigned To</TableHead>
          <TableHead className="font-bold text-[#75759E] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidentsData.map((incident) => (
          <TableRow key={incident.id} className="border-gray-100 hover:bg-gray-50/50">
            <TableCell className="font-bold text-[#1E1E2D]">{incident.id}</TableCell>
            <TableCell className="text-[#1E1E2D] font-medium">{incident.type}</TableCell>
            <TableCell className="text-[#75759E]">{incident.location}</TableCell>
            <TableCell className="text-[#75759E]">{incident.date}</TableCell>
            <TableCell>{getStatusBadge(incident.status)}</TableCell>
            <TableCell className="text-[#1E1E2D] font-medium">{incident.assignedTo}</TableCell>
            <TableCell className="text-right">
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
