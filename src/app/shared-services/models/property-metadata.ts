export interface DtoMetadata {
  PropertiesMetadata: PropertyMetadata[];
}

export class PropertyMetadata {
  public name: string;
  public controlType: ControlType = 'Text';
  public dataTypeName: string;
  public displayName: string;
  public isKey?: boolean;
  public isRequired?: boolean;
  public isRequiredTrue?: boolean;
  public isEmail?: boolean;
  public minLength?: number;
  public maxLength?: number;
  public regex?: string;
  public compareWithOtherProperty?: string;

  public hideForDisplay?: boolean;
  public hideForAdd?: boolean;
  public hideForEdit?: boolean;

}

export type ControlType = 'Text' | 'Number' | 'Date' | 'AutoComplete' | 'DateTime' | 'RadioButton' | 'Dropdown';

