// CampoFormulario: registro, llega todo por prps
export default function CampoFormulario({
  icono,
  id,
  name = id,
  tipo = "text",
  placeholder,
  valor,
  onChange,
}) {
  return (
    <div className="grupo-campo">
      <span className="icono-campo">{icono}</span>
      <input
        type={tipo}
        id={id}
        name={name}
        className="campo-entrada"
        placeholder={placeholder}
        value={valor}
        onChange={onChange}
      />
    </div>
  );
}