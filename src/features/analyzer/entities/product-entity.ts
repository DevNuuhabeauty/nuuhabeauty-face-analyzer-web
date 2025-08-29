// export interface ProductEntity {
//     name: string;
//     frequency: string;
//     how_to_use: string;
//     step: number;
//     disease: ConcernEntity;
//     productImages: string[];
//     externalLink: string;
// }

// export interface ConcernEntity {
//     name: string;
//     confidence_percent: number;
// }

// export interface RecommendedRoutineEntity {
//     product: ProductEntity;
// }

// export interface EnhancementRemarkEntity {
//     confidence_percent: number;
//     feature: string;
//     recommendation: string;
// }



export class ProductEntity {
    id?: string | undefined;
    name?: string | undefined;
    frequency?: string | undefined;
    how_to_use?: string | undefined;
    step?: number | undefined;
    enhancement_remark?: EnhancementRemarkEntity | undefined;
    productImages?: string[] | undefined;
    externalLink?: string | undefined;
    diseases?: ConcernEntity | undefined;
    steps?: string[] | undefined;
    diseasesDB?: ConcernEntity[] | undefined;

    constructor(data: ProductEntity) {
        this.id = data.id;
        this.name = data.name;
        this.frequency = data.frequency;
        this.how_to_use = data.how_to_use;
        this.step = data.step;
        this.enhancement_remark = data.enhancement_remark;
        this.productImages = data.productImages;
        this.externalLink = data.externalLink;
        this.diseases = data.diseases;
        this.steps = data.steps;
        this.diseasesDB = data.diseasesDB;
    }
    static fromJsonDB(json: any): ProductEntity {


        return new ProductEntity({
            id: json.id != null ? json.id : undefined,
            name: json.name != null ? json.name : undefined,
            frequency: json.frequency != null ? json.frequency : undefined,
            how_to_use: json.how_to_use != null ? json.how_to_use : undefined,
            productImages: json.productImages != null ? json.productImages : undefined,
            externalLink: json.externalLink != null ? json.externalLink : undefined,
            steps: json.steps != null ? json.steps : [],
            diseasesDB: json.disease != null ? json.disease.map((disease: any) => ConcernEntity.fromJsonDB(disease)) : undefined
        });
    }


    static fromJson(json: any): ProductEntity {
        return new ProductEntity({
            name: json.name != null ? json.name : undefined,
            frequency: json.frequency != null ? json.frequency : undefined,
            how_to_use: json.how_to_use != null ? json.how_to_use : undefined,
            step: json.step != null ? json.step : undefined,
            productImages: json.productImages != null ? json.productImages : undefined,
            externalLink: json.externalLink != null ? json.externalLink : undefined,
            enhancement_remark: json.enhancement_remark != null ? EnhancementRemarkEntity.fromJson(json.enhancement_remark) : undefined
        });
    }



    static fromJsonPy(json: any): ProductEntity {

        return new ProductEntity({
            name: json.name != null ? json.name : undefined,
            frequency: json.frequency != null ? json.frequency : undefined,
            how_to_use: json.how_to_use != null ? json.how_to_use : undefined,
            steps: json.steps != null ? json.steps.map((step: any) => step.step) : undefined,
            productImages: json.productImages != null ? json.productImages : undefined,
            externalLink: json.externalLink != null ? json.externalLink : undefined,
            // enhancement_remark: json.enhancement_remark != null ? EnhancementRemarkEntity.fromJson(json.enhancement_remark) : undefined,
            diseases: json.disease != null ? ConcernEntity.fromJson(json.disease) : ConcernEntity.fromJsonEnhancementRemark(json.enhancement_remark)
        });
    }

    static fromJsonConcern(json: any): ProductEntity {
        return new ProductEntity({
            name: json.name != null ? json.name : undefined,
            frequency: json.frequency != null ? json.frequency : undefined,
            how_to_use: json.how_to_use != null ? json.how_to_use : undefined,
            step: json.step != null ? json.step : undefined,
            productImages: json.productImages != null ? json.productImages : undefined,
            externalLink: json.externalLink != null ? json.externalLink : undefined,
            diseases: json.disease != null ? ConcernEntity.fromJson(json.disease) : undefined
        });
    }

    static fromJsonEnhancementRemark(json: any): ProductEntity {
        return new ProductEntity({
            name: json.name != null ? json.name : undefined,
            frequency: json.frequency != null ? json.frequency : undefined,
            how_to_use: json.how_to_use != null ? json.how_to_use : undefined,
            step: json.step != null ? json.step : undefined,
            enhancement_remark: json.enhancement_remark != null ? EnhancementRemarkEntity.fromJson(json.enhancement_remark) : undefined,
            productImages: json.productImages != null ? json.productImages : undefined,
            externalLink: json.externalLink != null ? json.externalLink : undefined
        });
    }


}

export class ConcernEntity {
    name?: string | undefined;
    confidence_percent?: number | undefined;
    ai_comment?: string | undefined;
    location?: string | undefined;
    how_to_use?: string | undefined;
    location_image_url?: string | undefined;


    constructor(data: ConcernEntity) {
        this.name = data.name;
        this.confidence_percent = data.confidence_percent;
        this.ai_comment = data.ai_comment;
        this.location = data.location;
        this.how_to_use = data.how_to_use;
        this.location_image_url = data.location_image_url;
    }

    static fromJson(json: any): ConcernEntity {
        return new ConcernEntity({
            name: json.name != null ? json.name : undefined,
            confidence_percent: json.confidence_percent != null ? json.confidence_percent : undefined,
            ai_comment: json.ai_comment != null ? json.ai_comment : undefined,
            location: json.location != null ? json.location : undefined,
            how_to_use: json.how_to_use != null ? json.how_to_use : undefined
        });
    }

    static fromJsonEnhancementRemark(json: any): ConcernEntity {
        return new ConcernEntity({
            name: json.feature != null ? json.feature : undefined,
            confidence_percent: json.confidence_percent != null ? json.confidence_percent : undefined,
            ai_comment: json.recommendation != null ? json.recommendation : undefined,
            location: json.location != null ? json.location : undefined,
            how_to_use: json.how_to_use != null ? json.how_to_use : undefined
        });
    }

    static fromJsonDB(json: any): ConcernEntity {
        console.log("Concern", json);
        return new ConcernEntity({
            name: json.name != null ? json.name : undefined,
            confidence_percent: json.confidence_percentage != null ? json.confidence_percentage : undefined,
            ai_comment: json.ai_recommend != null ? json.ai_recommend : undefined,
            location: json.location != null ? json.location : undefined,
            how_to_use: json.how_to_use != null ? json.how_to_use : undefined
        });
    }
}


export class GoodEntity {
    name?: string | undefined;
    confidence_percent?: number | undefined;
    ai_comment?: string | undefined;
    location?: string | undefined;
    how_to_use?: string | undefined;

    constructor(data: GoodEntity) {
        this.name = data.name;
        this.confidence_percent = data.confidence_percent;
        this.ai_comment = data.ai_comment;
        this.location = data.location;
        this.how_to_use = data.how_to_use;
    }

    static fromJson(json: any): GoodEntity {
        return new GoodEntity({
            name: json.name != null ? json.name : undefined,
            confidence_percent: json.confidence != null ? json.confidence : undefined,
            ai_comment: json.ai_comment != null ? json.ai_comment : undefined,
            location: json.location != null ? json.location : undefined,
            how_to_use: json.how_to_use != null ? json.how_to_use : undefined
        });
    }



    static fromJsonDB(json: any): GoodEntity {
        return new GoodEntity({
            name: json.name != null ? json.name : undefined,
            confidence_percent: json.confidence_percentage != null ? json.confidence_percentage : undefined,
            ai_comment: json.ai_recommend != null ? json.ai_recommend : undefined,
            location: json.location != null ? json.location : undefined,
            how_to_use: json.how_to_use != null ? json.how_to_use : undefined
        });
    }
}


export class EnhancementRemarkEntity {
    confidence_percent?: number | undefined;
    feature?: string | undefined;
    recommendation?: string | undefined;

    constructor(data: EnhancementRemarkEntity) {
        this.confidence_percent = data.confidence_percent;
        this.feature = data.feature;
        this.recommendation = data.recommendation;
    }

    static fromJson(json: any): EnhancementRemarkEntity {
        return new EnhancementRemarkEntity({
            confidence_percent: json.confidence_percent != null ? json.confidence_percent : undefined,
            feature: json.feature != null ? json.feature : undefined,
            recommendation: json.recommendation != null ? json.recommendation : undefined
        });
    }
}





// {
//     "analysis": {
//         "detected_diseases": {
//             "diseases": [
//                 {
//                     "confidence_percent": 95,
//                     "name": "Dryness"
//                 },
//                 {
//                     "confidence_percent": 90,
//                     "name": "Dehydration"
//                 },
//                 {
//                     "confidence_percent": 80,
//                     "name": "Dullness"
//                 },
//                 {
//                     "confidence_percent": 70,
//                     "name": "Uneven skin tone"
//                 },
//                 {
//                     "confidence_percent": 60,
//                     "name": "Redness"
//                 }
//             ]
//         },
//         "recommended_routine": [
//             {
//                 "product": {
//                     "frequency": "Morning and evening",
//                     "how_to_use": "Apply a small amount to damp skin, gently massage in circular motions, and rinse thoroughly with lukewarm water.",
//                     "name": "NUUHA BEAUTY MUGWORT HYDRA BRIGHT GENTLE DAILY FOAM CLEANSER",
//                     "step": 1
//                 }
//             },
//             {
//                 "product": {
//                     "frequency": "Morning, evening, and as needed throughout the day",
//                     "how_to_use": "Close your eyes and mist your face and neck after cleansing, before serums, and throughout the day as needed.",
//                     "name": "NUUHA BEAUTY 4 IN 1 HYDRA BRIGHT ULTIMATE KOREAN WATER MIST",
//                     "step": 2
//                 }
//             },
//             {
//                 "product": {
//                     "frequency": "Morning and evening",
//                     "how_to_use": "Apply 2-3 drops to clean, dry skin and gently massage until fully absorbed. Can be layered under other serums or moisturizer.",
//                     "name": "NUUHA BEAUTY 10X SOOTHING COMPLEX HYPER RELIEF SERUM",
//                     "step": 3
//                 }
//             },
//             {
//                 "product": {
//                     "frequency": "Morning and evening",
//                     "how_to_use": "Apply 2-3 drops to clean, dry skin after the Hyper Relief Serum and gently massage until fully absorbed.",
//                     "name": "NUUHA BEAUTY 4X BRIGHTENING COMPLEX ADVANCED GLOW SERUM",
//                     "step": 4
//                 }
//             },
//             {
//                 "product": {
//                     "frequency": "Morning and evening",
//                     "how_to_use": "Apply a pea-sized amount to the face and neck after serums, gently massage until fully absorbed.",
//                     "name": "NUUHA BEAUTY 7X PEPTIDE ULTIMATE GLASS SKIN MOISTURISER",
//                     "step": 5
//                 }
//             },
//             {
//                 "product": {
//                     "frequency": "Every morning",
//                     "how_to_use": "Apply liberally to face and neck 15 minutes before sun exposure. Reapply every 2 hours, especially after swimming or sweating.",
//                     "name": "NUUHA BEAUTY ULTRA GLOW BRIGHTENING SERUM SUNSCREEN SPF50+ PA++++",
//                     "step": 6
//                 }
//             }
//         ]
//     },
//     "status": "success"
// }