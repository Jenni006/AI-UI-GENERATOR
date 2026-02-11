import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function Home() {
  return (
    <div>
      <Card>
        <h2>Test UI</h2>
        <Input placeholder="Enter name" />
        <Button>Submit</Button>
      </Card>
    </div>
  );
}
