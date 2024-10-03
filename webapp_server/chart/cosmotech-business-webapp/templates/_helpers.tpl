{{/* Generates the name of the webapp server */}}
{{- define "cosmotech-business-webapp.server-name" -}}
{{ .Values.name }}-server
{{- end }}

{{/* Generates the name of the webapp functions */}}
{{- define "cosmotech-business-webapp.functions-name" -}}
{{ .Values.name }}-functions
{{- end }}
