const labels: Record<string, string> = {
  requested: "Requested", accepted: "Accepted", "in-progress": "In Progress",
  completed: "Completed", rejected: "Rejected", cancelled: "Cancelled",
  paid: "Paid", unpaid: "Unpaid", pending: "Pending", approved: "Approved",
};

export default function StatusBadge({ value }: { value: string }) {
  return (
    <span className={`badge badge-${value} gap-1.5`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[value] || value}
    </span>
  );
}