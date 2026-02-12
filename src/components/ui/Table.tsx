"use client";

interface TableProps {
  title?: string;
}

export default function Table({ title }: TableProps) {
  return (
    <div>
      {title && <h3>{title}</h3>}
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
