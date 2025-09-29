import ValidationResultBadge from '../ValidationResultBadge';

export default function ValidationResultBadgeExample() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <ValidationResultBadge result="OK" />
        <ValidationResultBadge result="NÃO READEQUAR" />
      </div>
    </div>
  );
}