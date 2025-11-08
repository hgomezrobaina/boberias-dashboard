import { Button } from "@/components/ui/button";

interface Props {
  onClick?: () => void;
  icon: React.ReactNode;
}

export default function IconButton({ icon, onClick }: Props) {
  return (
    <Button size="icon-sm" variant="outline" onClick={onClick}>
      {icon}
    </Button>
  );
}
