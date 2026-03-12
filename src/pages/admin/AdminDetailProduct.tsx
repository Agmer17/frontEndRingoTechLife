import { useEffect, useState } from "react";
import ProductDetail from "../../components/shared/ProductDetail";
import { useAdminProducts } from "../../hooks/admin/useAdminProducts";
import type { ProductDetailResponse } from "../../types/product";
import { useParams } from "react-router";
import { useToast } from "../../hooks/ui/useToast";
import { Toast } from "../../components/shared/Toast";
import { useReviews } from "../../hooks/review/useReviews";
import type { CreateReviewRequest, Review, UpdateReviewRequest } from "../../types/review";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";



export default function AdminDetailProducts() {
    const { slug } = useParams()
    const { getProductBySlug } = useAdminProducts()
    const [product, setProduct] = useState<ProductDetailResponse | null>(null)
    const { toast, dismissToast, showToast } = useToast();

    const { create: createReview, deleteReview, editReview } = useReviews()
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)

    const currentUserId = useSelector((state: RootState) => state.auth.id)


    useEffect(() => {
        const fetchdata = async () => {
            const data = await getProductBySlug(slug || "")
            if (data.success) {
                setProduct(data.data)
            }
        }

        fetchdata()
    }, [])

    const onSubmitReview = async (data: CreateReviewRequest) => {

        const resp = await createReview(data)

        if (resp.success) {
            showToast("success", resp.message)
            const refetchRes = await getProductBySlug(slug || "")

            if (refetchRes.success) {
                setProduct(refetchRes.data)
                setShowReviewForm(false)
            }
        } else {
            showToast("error", resp.error)
        }

    }


    const onDeleteReview = async (review: Review) => {
        const resp = await deleteReview(review.review_id)

        if (resp.success) {
            showToast("success", resp.message)
            const refetchRes = await getProductBySlug(slug || "")

            if (refetchRes.success) {
                setProduct(refetchRes.data)
                setShowReviewForm(false)
            }
        } else {
            showToast("error", resp.error)
        }
    }

    const onEditReview = async (newData: UpdateReviewRequest, id: string) => {

        const res = await editReview(newData, id)

        if (res.success) {
            showToast("success", res.message)
            const refetchRes = await getProductBySlug(slug || "")
            if (refetchRes.success) {
                setProduct(refetchRes.data)
                setShowEditForm(false)
            }
        } else {
            showToast("error", res.error)
        }
    }

    return (
        <div className="md:p-6">
            <Toast
                toast={toast}
                onDismiss={dismissToast}
                successTitle="Update Berhasil!"
                errorTitle="Update Gagal"
            />
            {product && (
                <ProductDetail
                    product={product}
                    imageBaseUrl={`${import.meta.env.VITE_IMAGE_URL}/products/`}
                    onSubmitReview={onSubmitReview}
                    showReviewForm={showReviewForm}
                    setShowReviewForm={setShowReviewForm}
                    currentUserId={currentUserId || ""}
                    isAdmin={true}
                    onDeleteReview={onDeleteReview}
                    onEdit={onEditReview}
                    editFormReview={showEditForm}
                    setEditFormReview={setShowEditForm}

                    onSubmitEdit={onEditReview}
                />
            )}
        </div>
    )
}