export class AnalysisSummaryEntity {
    total_analysis?: number;
    total_diseases?: number;
    recent_disease?: string;
    skin_condition?: number;

    constructor(data: AnalysisSummaryEntity) {
        this.total_analysis = data.total_analysis;
        this.total_diseases = data.total_diseases;
        this.recent_disease = data.recent_disease;
        this.skin_condition = data.skin_condition;
    }

    static fromJson(json: any): AnalysisSummaryEntity {
        const data = json;
        return new AnalysisSummaryEntity({
            total_analysis: data.total_analysis ?? 0,
            total_diseases: data.total_diseases ?? 0,
            recent_disease: data.recent_disease ?? 'No Concern',
            skin_condition: data.skin_condition ?? 0,
        });
    }
}

