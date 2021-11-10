// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export class PowerBiReportDetails {
  constructor(reportId, reportName, embedUrl) {
    this.reportId = reportId;
    this.reportName = reportName;
    this.embedUrl = embedUrl;
  }
}

export class EmbedConfig {
  constructor(type, reportsDetail, accessToken, expiresOn) {
    this.type = type;
    this.reportsDetail = reportsDetail;
    this.accessToken = accessToken;
    this.expiresOn = expiresOn;
  }
}
