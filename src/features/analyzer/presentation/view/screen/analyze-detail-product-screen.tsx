import { ProductEntity } from "../../../entities/product-entity"
import ProductDetailDialogCard from "../components/product-detail-dialog-card"

const AnalyzeDetailProductScreen = ({ products }: { products: ProductEntity[] }) => {
    return (
        <div className="flex flex-col items-start justify-center gap-2 w-full">
            <p className="text-xl md:text-2xl font-bold">Products Recommendation</p>
            <div className="grid items-start justify-center grid-cols-1 md:grid-cols-2  gap-8 w-full">
                {products?.map((product: ProductEntity, index: number) => (
                    <ProductDetailDialogCard key={product.name || index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default AnalyzeDetailProductScreen;