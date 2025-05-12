export default function ServicesList({ services }) {
  if (!services?.length)
    return <p>Este profesional aún no añadió servicios.</p>;

  return (
    <ul className="divide-y">
      {services.map((s) => (
        <li key={s.id} className="py-3 flex justify-between items-start">
          <div>
            <h4 className="font-medium">{s.title}</h4>
            <p className="text-sm text-gray-600">{s.category.name}</p>
          </div>
          <span className="font-semibold">${s.price}</span>
        </li>
      ))}
    </ul>
  );
}
