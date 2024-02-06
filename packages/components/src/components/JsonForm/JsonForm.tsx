import React, { useState } from 'react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { Typography } from '@mui/material';
import { JsonForms } from '@jsonforms/react';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { IComponentFunc } from '../../types';

/**
 * The props for the JsonForm component
 * @typedef IRenderJsonSchemaProps
 * @property {Object} schema - The json schema.
 * @property {Object} [uiSchema] - The ui schema.
 * @property {Object} [initialData] - The initial data.
 * @property {string} [className] - The class name.
 * @property {Function} onChange - The function to be called when the form changes.
 */
export interface IJsonFormProps extends IComponentFunc {
  schema: JsonSchema;
  uiSchema?: UISchemaElement;
  initialData?: any;
  className?: string;
  formTitle?: string;
}

/**
 * Receive a json schema and render a form.
 * @returns {React.ReactElement} The rendered component.
 */
export const JsonForm = ({ schema, uiSchema, initialData, onChange, formTitle, className, ...props }: IJsonFormProps) => {
  const [data, setData] = useState(initialData);

  const handleChange = ({ errors, data }: { errors: any[]; data: any }) => {
    setData(data);
    if (errors.length > 0) {
      onChange && onChange({ data, errors });
    } else {
      onChange && onChange({ data });
    }
  };

  return (
    <div className={className} {...props}>
      <Typography
        sx={{
          paddingBottom: '40px',
          fontSize: '1.5rem',
        }}
      >
        {formTitle}
      </Typography>

      <JsonForms
        schema={schema}
        uischema={uiSchema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={handleChange}
      />
    </div>
  );
};
