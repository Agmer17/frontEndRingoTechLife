import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
    value: number;
    onChange: (value: number) => void;
}

export default function StarRatingInput({ value, onChange }: Props) {
    const [hover, setHover] = useState<number | null>(null);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const active = hover !== null ? star <= hover : star <= value;

                return (
                    <Star
                        key={star}
                        size={28}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => onChange(star)}
                        className={`cursor-pointer transition-all ${active
                            ? "fill-warning text-warning"
                            : "text-base-content opacity-30"
                            }`}
                    />
                );
            })}
        </div>
    );
}