// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export class PowerBIReportEmbedSimpleFilter {
  constructor (table, column, acceptedValue) {
    if (typeof table !== 'string' || typeof column !== 'string') {
      throw new Error('table and column should be a string');
    }
    this.$schema = 'http://powerbi.com/product/schema#basic';
    this.target = new PowerBIReportEmbedTarget(table, column);
    this.operator = 'eq';
    this.values = [acceptedValue];
  }
}

export class PowerBIReportEmbedMultipleFilter {
  constructor (table, column, acceptedValues) {
    if (typeof table !== 'string' || typeof column !== 'string') {
      throw new Error('table and column should be a string');
    }
    if (!Array.isArray(acceptedValues)) {
      throw new Error('acceptedValues should be an array');
    }
    this.$schema = 'http://powerbi.com/product/schema#basic';
    this.target = new PowerBIReportEmbedTarget(table, column);
    this.operator = 'in';
    this.values = acceptedValues;
  }
}

class PowerBIReportEmbedTarget {
  constructor (table, column) {
    if (typeof table !== 'string' || typeof column !== 'string') {
      throw new Error('table and column should be a string');
    }
    this.table = table;
    this.column = column;
  }
}
