export default function HoneypotField({ value, onChange }) {
  return (
    <div
      className="hp-field"
      aria-hidden="true"
      style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
    >
      <label htmlFor="contact-website">Website</label>
      <input
        type="text"
        id="contact-website"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
