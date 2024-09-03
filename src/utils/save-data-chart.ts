import {
  ChartData,
  ChartMetaInfo,
  ChartTemplate,
  ChartTemplateContent,
  IExternalSaveLoadAdapter,
  LineToolState,
  LineToolsAndGroupsLoadRequestContext,
  LineToolsAndGroupsLoadRequestType,
  LineToolsAndGroupsState,
  StudyTemplateData,
  StudyTemplateMetaInfo,
} from "@@/public/static/charting_library";

interface SavedChartData extends ChartData {
  timestamp: number;
  id: string;
}

interface DrawingTemplate {
  name: string;
  toolName: string;
  content: string;
}

interface SavedChartTemplate extends ChartTemplate {
  name: string;
}

const storageKeys = {
  charts: "LocalStorageSaveLoadAdapter_charts",
  studyTemplates: "LocalStorageSaveLoadAdapter_studyTemplates",
  drawingTemplates: "LocalStorageSaveLoadAdapter_drawingTemplates",
  chartTemplates: "LocalStorageSaveLoadAdapter_chartTemplates",
  drawings: "LocalStorageSaveLoadAdapter_drawings",
} as const;

type LayoutDrawings = Record<string, LineToolState>;
type SavedDrawings = Record<string, LayoutDrawings>;

class LocalStorageSaveLoadAdapter implements IExternalSaveLoadAdapter {
  private _charts: SavedChartData[] = [];
  private _studyTemplates: StudyTemplateData[] = [];
  private _drawingTemplates: DrawingTemplate[] = [];
  private _chartTemplates: SavedChartTemplate[] = [];
  private _isDirty = false;
  protected _drawings: SavedDrawings = {};

  public constructor() {
    this._charts =
      this._getFromLocalStorage<SavedChartData[]>(storageKeys.charts) ?? [];
    this._studyTemplates =
      this._getFromLocalStorage<StudyTemplateData[]>(
        storageKeys.studyTemplates
      ) ?? [];
    this._drawingTemplates =
      this._getFromLocalStorage<DrawingTemplate[]>(
        storageKeys.drawingTemplates
      ) ?? [];
    this._chartTemplates =
      this._getFromLocalStorage<SavedChartTemplate[]>(
        storageKeys.chartTemplates
      ) ?? [];
    this._drawings =
      this._getFromLocalStorage<SavedDrawings>(storageKeys.drawings) ?? {};
    setInterval(() => {
      if (this._isDirty) {
        this._saveAllToLocalStorage();
        this._isDirty = false;
      }
    }, 1000);
  }

  public getAllCharts(): Promise<ChartMetaInfo[]> {
    return Promise.resolve(this._charts) as any;
  }

  public removeChart(id: string | number) {
    for (let i = 0; i < this._charts.length; ++i) {
      if (this._charts[i].id === id) {
        this._charts.splice(i, 1);
        this._isDirty = true;
        return Promise.resolve();
      }
    }
    return Promise.reject(new Error("The chart does not exist"));
  }

  public saveChart(chartData: ChartData): Promise<string> {
    if (!chartData.id) {
      chartData.id = this._generateUniqueChartId();
    } else {
      this.removeChart(chartData.id);
    }
    const savedChartData: SavedChartData = {
      ...chartData,
      id: chartData.id,
      timestamp: Math.round(Date.now() / 1000),
    };
    this._charts.push(savedChartData);
    this._isDirty = true;
    return Promise.resolve(savedChartData.id);
  }

  public getChartContent(id: string | number): Promise<string> {
    for (let i = 0; i < this._charts.length; ++i) {
      if (this._charts[i].id === id) {
        return Promise.resolve(this._charts[i].content);
      }
    }
    return Promise.reject(new Error("The chart does not exist"));
  }

  public removeStudyTemplate(
    studyTemplateData: StudyTemplateMetaInfo
  ): Promise<void> {
    for (let i = 0; i < this._studyTemplates.length; ++i) {
      if (this._studyTemplates[i].name === studyTemplateData.name) {
        this._studyTemplates.splice(i, 1);
        this._isDirty = true;
        return Promise.resolve();
      }
    }
    return Promise.reject(new Error("The study template does not exist"));
  }

  public getStudyTemplateContent(
    studyTemplateData: StudyTemplateMetaInfo
  ): Promise<string> {
    for (let i = 0; i < this._studyTemplates.length; ++i) {
      if (this._studyTemplates[i].name === studyTemplateData.name) {
        return Promise.resolve(this._studyTemplates[i].content);
      }
    }
    return Promise.reject(new Error("The study template does not exist"));
  }

  public saveStudyTemplate(studyTemplateData: StudyTemplateData) {
    for (let i = 0; i < this._studyTemplates.length; ++i) {
      if (this._studyTemplates[i].name === studyTemplateData.name) {
        this._studyTemplates.splice(i, 1);
        break;
      }
    }
    this._studyTemplates.push(studyTemplateData);
    this._isDirty = true;
    return Promise.resolve();
  }

  public getAllStudyTemplates(): Promise<StudyTemplateData[]> {
    return Promise.resolve(this._studyTemplates);
  }

  public removeDrawingTemplate(
    toolName: string,
    templateName: string
  ): Promise<void> {
    for (let i = 0; i < this._drawingTemplates.length; ++i) {
      if (
        this._drawingTemplates[i].name === templateName &&
        this._drawingTemplates[i].toolName === toolName
      ) {
        this._drawingTemplates.splice(i, 1);
        this._isDirty = true;
        return Promise.resolve();
      }
    }
    return Promise.reject(new Error("The drawing template does not exist"));
  }

  public loadDrawingTemplate(
    toolName: string,
    templateName: string
  ): Promise<string> {
    for (let i = 0; i < this._drawingTemplates.length; ++i) {
      if (
        this._drawingTemplates[i].name === templateName &&
        this._drawingTemplates[i].toolName === toolName
      ) {
        return Promise.resolve(this._drawingTemplates[i].content);
      }
    }
    return Promise.reject(new Error("The drawing template does not exist"));
  }

  public saveDrawingTemplate(
    toolName: string,
    templateName: string,
    content: string
  ): Promise<void> {
    for (let i = 0; i < this._drawingTemplates.length; ++i) {
      if (
        this._drawingTemplates[i].name === templateName &&
        this._drawingTemplates[i].toolName === toolName
      ) {
        this._drawingTemplates.splice(i, 1);
        break;
      }
    }
    this._drawingTemplates.push({
      name: templateName,
      content: content,
      toolName: toolName,
    });
    this._isDirty = true;
    return Promise.resolve();
  }

  public getDrawingTemplates(): Promise<string[]> {
    return Promise.resolve(
      this._drawingTemplates.map(function (template: DrawingTemplate) {
        return template.name;
      })
    );
  }

  public async getAllChartTemplates(): Promise<string[]> {
    return this._chartTemplates.map((x) => x.name);
  }

  public async saveChartTemplate(
    templateName: string,
    content: ChartTemplateContent
  ): Promise<void> {
    const theme = this._chartTemplates.find((x) => x.name === templateName);
    if (theme) {
      theme.content = content;
    } else {
      this._chartTemplates.push({ name: templateName, content });
    }
    this._isDirty = true;
  }

  public async removeChartTemplate(templateName: string): Promise<void> {
    this._chartTemplates = this._chartTemplates.filter(
      (x) => x.name !== templateName
    );
    this._isDirty = true;
  }

  public async getChartTemplateContent(
    templateName: string
  ): Promise<ChartTemplate> {
    const content = this._chartTemplates.find(
      (x) => x.name === templateName
    )?.content;
    return {
      content: structuredClone(content),
    };
  }

  // Only used if `saveload_separate_drawings_storage` featureset is enabled
  public async saveLineToolsAndGroups(
    layoutId: string,
    chartId: string | number,
    state: LineToolsAndGroupsState
  ): Promise<void> {
    const drawings = state.sources;
    if (!drawings) return;

    if (!this._drawings[this._getDrawingKey(layoutId, chartId)]) {
      this._drawings[this._getDrawingKey(layoutId, chartId)] = {};
    }

    for (const [key, state] of drawings) {
      if (state === null) {
        delete this._drawings[this._getDrawingKey(layoutId, chartId)][key];
      } else {
        this._drawings[this._getDrawingKey(layoutId, chartId)][key] = state;
      }
    }
    this._isDirty = true;
  }

  // Only used if `saveload_separate_drawings_storage` featureset is enabled
  public async loadLineToolsAndGroups(
    layoutId: string | undefined,
    chartId: string | number,
    _requestType: LineToolsAndGroupsLoadRequestType,
    _requestContext: LineToolsAndGroupsLoadRequestContext
  ): Promise<Partial<LineToolsAndGroupsState> | null> {
    if (!layoutId) {
      return null;
    }
    const rawSources = this._drawings[this._getDrawingKey(layoutId, chartId)];
    if (!rawSources) return null;
    const sources = new Map();

    for (const [key, state] of Object.entries(rawSources)) {
      sources.set(key, state);
    }

    return {
      sources,
    };
  }

  private _generateUniqueChartId(): string {
    const existingIds = this._charts.map((i) => i.id);
    while (true) {
      const uid = Math.random().toString(16).slice(2);
      if (!existingIds.includes(uid)) {
        return uid;
      }
    }
  }

  protected _getFromLocalStorage<T>(key: string): T {
    const dataFromStorage = window.localStorage.getItem(key);
    return JSON.parse(dataFromStorage || "null");
  }

  protected _saveToLocalStorage(key: string, data: any): void {
    const dataString = JSON.stringify(data);
    window.localStorage.setItem(key, dataString);
  }

  protected _saveAllToLocalStorage(): void {
    this._saveToLocalStorage(storageKeys.charts, this._charts);
    this._saveToLocalStorage(storageKeys.studyTemplates, this._studyTemplates);
    this._saveToLocalStorage(
      storageKeys.drawingTemplates,
      this._drawingTemplates
    );
    this._saveToLocalStorage(storageKeys.chartTemplates, this._chartTemplates);
    this._saveToLocalStorage(storageKeys.drawings, this._drawings);
  }

  private _getDrawingKey(layoutId: string, chartId: string | number): string {
    return `${layoutId}/${chartId}`;
  }
}

export default LocalStorageSaveLoadAdapter;
