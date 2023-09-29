export type TDocument = {
  document_id: number;
  document_name: string;
};

export type TCustomer = {
  customer_id: number;
  customer_name: string;
};

export type TSection = {
  section_id: number;
  section_name: string;
};

export type TVersion = {
  document_id: number;
  customer_id: number;
  document_version: string;
  change?: string;
  pending_id?: number;
  intro_page?: string | null;
};

export type TDocumentContent = {
  module_ver: TModuleVer;
  pending_id?: number | null;
};

export type TModuleList = {
  customer_id?: number | null;
  module_ver: TModuleVer;
};

export type TTOC = {
  [key: string]: {
    page: number;
    children: TTOC;
  };
};

export type TModuleVer = {
  module_id: number;
  module_version: string;
  module_name?: string;
  module_description?: string;
  module_inclusion?: string;
  module_exclusion?: string;
  module_granularity?: string;
  module_identifiers?: string;
  change?: string;
  pending_id?: number;
  module: {
    section_id: number;
    section?: {
      section_id: number;
      section_name?: string;
    };
  };
  column_module?: {
    column_ver?: TColumnVer;
  }[];
};

export type TColumnVer = {
  column_id: number;
  column_version: string;
  column_name?: string;
  column_description?: string;
  column_type?: string;
  change?: string;
  pending_id?: number;
};
