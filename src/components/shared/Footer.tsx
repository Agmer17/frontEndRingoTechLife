import { Phone, Mail, Clock, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
    const GOOGLE_MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.2087634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f436b8c94b07%3A0x6ea6d4f8b7a0d51c!2sMonumen+Nasional!5e0!3m2!1sid!2sid!4v1710000000000";
    const GOOGLE_MAPS_LINK = "https://maps.google.com/?q=Monumen+Nasional,Jakarta";

    return (
        <footer className="bg-base-200 border-t border-base-300">
            <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand */}
                <div className="flex flex-col gap-3">
                    <span className="text-xl font-bold text-primary tracking-tight">
                        Ringo <span className="text-base-content font-normal">Techlife</span>
                    </span>
                    <p className="text-sm text-base-content/60 leading-relaxed">
                        Toko elektronik dan service center terpercaya. Jual beli gadget, aksesoris, dan perbaikan perangkat elektronik.
                    </p>
                    <div className="flex gap-3 mt-1">
                        <a href="#" className="btn btn-ghost btn-xs px-2">Instagram</a>
                        <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="btn btn-ghost btn-xs px-2">WhatsApp</a>
                        <a href="#" className="btn btn-ghost btn-xs px-2">Tokopedia</a>
                    </div>
                </div>

                {/* Contact */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-base-content/40">Kontak</h4>
                    <ul className="space-y-2 text-sm text-base-content/70">
                        <li className="flex items-start gap-2">
                            <Phone size={14} className="mt-0.5 shrink-0 text-primary" />
                            <span>+62 812-3456-7890</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Mail size={14} className="mt-0.5 shrink-0 text-primary" />
                            <span>info@ringotechlife.id</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Clock size={14} className="mt-0.5 shrink-0 text-primary" />
                            <span>Senin – Sabtu, 09.00 – 20.00</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <MapPin size={14} className="mt-0.5 shrink-0 text-primary" />
                            <span>Jl. Raya Elektronik No. 12, Jakarta</span>
                        </li>
                    </ul>
                </div>

                {/* Google Maps */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-base-content/40">Lokasi Kami</h4>

                    <div className="rounded-xl overflow-hidden border border-base-300 h-40 w-full">
                        <iframe
                            src={GOOGLE_MAPS_EMBED}
                            className="w-full h-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                    </div>

                    <a
                        href={GOOGLE_MAPS_LINK}
                        target="_blank"
                        rel="noreferrer"
                        title="Buka lokasi di Google Maps"
                        aria-label="Buka lokasi di Google Maps"
                        className="inline-flex items-center gap-1 text-primary hover:underline text-xs w-fit"
                    >
                        <ExternalLink size={11} />
                        Buka di Google Maps
                    </a>
                </div>

            </div>

            {/* Bottom bar */}
            <div className="border-t border-base-300">
                <div className="max-w-5xl mx-auto px-4 py-3 text-xs text-base-content/40 text-center">
                    © {new Date().getFullYear()} Ringo Techlife. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;