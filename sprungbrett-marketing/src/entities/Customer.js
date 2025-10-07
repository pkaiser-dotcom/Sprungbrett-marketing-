{
  "name": "Customer",
  "type": "object",
  "properties": {
    "company": { "type": "string", "description": "Firmenname" },
    "first_name": { "type": "string", "description": "Ansprechpartner Vorname" },
    "last_name": { "type": "string", "description": "Ansprechpartner Nachname" },
    "phone": { "type": "string", "description": "Telefon" },
    "email": { "type": "string", "format": "email", "description": "E-Mail" },
    "mobile": { "type": "string", "description": "Handy (optional)" },
    "services": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["Marketing","Instagram","Facebook","Sportstättenmanagement","Eventmanagement","Grafiken"]
      },
      "description": "Beauftragte Leistungen"
    },
    "notes": { "type": "string", "description": "Interne Notizen" }
  },
  "required": ["company", "email"],
  "rls": {
    "read": { "$or": [ {}, { "user_condition": { "role": "admin" } } ] },
    "write": { "created_by": "{{user.email}}" }
  }
}
