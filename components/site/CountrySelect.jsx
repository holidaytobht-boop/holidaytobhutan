'use client'

import { Form } from 'react-bootstrap'
import { getPopularCountries, getOtherCountries } from '@/lib/constants/countries'

function CountrySelect({
  id,
  label,
  required = false,
  hint,
  error,
  value,
  onChange,
  placeholder = 'Select country',
}) {
  const popular = getPopularCountries()
  const other = getOtherCountries()

  return (
    <Form.Group controlId={id}>
      <Form.Label>
        {label}
        {required ? <span className="planner-required" aria-hidden="true"> *</span> : null}
      </Form.Label>
      <Form.Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'is-invalid' : ''}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      >
        <option value="">{placeholder}</option>
        <optgroup label="Popular">
          {popular.map((c) => (
            <option key={c.code} value={c.name}>
              {c.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="All countries">
          {other.map((c) => (
            <option key={c.code} value={c.name}>
              {c.name}
            </option>
          ))}
        </optgroup>
      </Form.Select>
      {hint && !error ? (
        <Form.Text id={`${id}-hint`} className="text-muted">
          {hint}
        </Form.Text>
      ) : null}
      {error ? (
        <div id={`${id}-error`} className="invalid-feedback d-block">
          {error}
        </div>
      ) : null}
    </Form.Group>
  )
}

export default CountrySelect
