import { ConcernEntity, GoodEntity, ProductEntity } from "./product-entity";

export class AnalysisEntity {
    products?: ProductEntity[] | [];
    skin_condition?: string | undefined;
    status_face?: string | undefined;
    userImage?: string | undefined;
    analyzeId?: string | undefined;
    created_at?: Date | undefined;
    user_id?: string | undefined;
    ai_recommendation?: string | undefined;
    diseases?: ConcernEntity[] | [];
    good?: GoodEntity[] | [];


    constructor(data: AnalysisEntity) {
        this.products = data.products;
        this.skin_condition = data.skin_condition;
        this.status_face = data.status_face;
        this.userImage = data.userImage;
        this.analyzeId = data.analyzeId;
        this.created_at = data.created_at;
        this.user_id = data.user_id;
        this.ai_recommendation = data.ai_recommendation;
        this.diseases = data.diseases;
        this.good = data.good;
    }

    static fromJsonDB(json: any): AnalysisEntity {
        return new AnalysisEntity({
            products: json.products != null ? json.products.map((product: any) => ProductEntity.fromJsonDB(product)) : undefined,
            skin_condition: json.skin_condition != null ? json.skin_condition : undefined,
            status_face: json.skin_status != null ? json.skin_status : undefined,
            analyzeId: json.id != null ? json.id : undefined,
            userImage: json.image_url != null ? json.image_url : undefined,
            created_at: json.created_at != null ? new Date(json.created_at) : undefined,
            user_id: json.user_id != null ? json.user_id : undefined,
            ai_recommendation: json.ai_recommendation != null ? json.ai_recommendation : undefined,
            diseases: json.diseases != null ? json.diseases.map((disease: any) => ConcernEntity.fromJsonDB(disease)) : undefined,
            good: json.goods != null ? json.goods.map((good: any) => GoodEntity.fromJsonDB(good)) : undefined,
        });
    }

    static fromJsonPy(json: any): AnalysisEntity {
        return new AnalysisEntity({
            products: json.products != null ? json.products.map((product: any) => ProductEntity.fromJsonPy(product)) : undefined,
            skin_condition: json.skin_condition != null ? json.skin_condition : undefined,
            status_face: json.status_face != null ? json.status_face : undefined,
            analyzeId: json.analysis_id != null ? json.analysis_id : undefined,
            userImage: json.user_image != null ? json.user_image : undefined,
            created_at: json.created_at != null ? new Date(json.created_at) : undefined,
            user_id: json.user_id != null ? json.user_id : undefined,
            good: json.positive_features != null ? json.positive_features.map((good: any) => GoodEntity.fromJson(good)) : undefined,
        });
    }

    static toJson(analysis: AnalysisEntity): any {
        return {
            products: analysis.products?.map((product: ProductEntity) => product.name),
            skin_condition: analysis.skin_condition,
            status_face: analysis.status_face,
            image_url: analysis.userImage,
            user_id: analysis.user_id,
            diseases: analysis.diseases?.map((disease: ConcernEntity) => disease.name) || [],
        };
    }

}
