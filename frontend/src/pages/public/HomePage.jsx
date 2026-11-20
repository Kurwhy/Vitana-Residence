import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bike,
  Camera,
  Check,
  Clock,
  CookingPot,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shirt,
  ShoppingBasket,
  Sofa,
  Wifi,
} from 'lucide-react'
import { ParallaxImage, Reveal } from '../../components/Reveal'
import { RoomCard } from '../../components/RoomCard'
import {
  EmptyState,
  ErrorState,
  SectionLabel,
  Skeleton,
  buttonStyles,
} from '../../components/ui'
import { jamOperasional } from '../../data/config'
import { usePublicKamar, usePublicProfile } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { useCountUp, useInView } from '../../hooks/useScrollReveal'
import { formatRupiah, normalizeWhatsApp } from '../../lib/utils'

const facilityDetails = {
  'WiFi Fiber 100 Mbps': {
    icon: Wifi,
    description: 'Koneksi stabil untuk kuliah daring, tugas, dan hiburan di kamar.',
  },
  'Dapur Bersama dan Kulkas': {
    icon: CookingPot,
    description: 'Area memasak dan kulkas bersama yang dibersihkan secara rutin.',
  },
  'Ruang Tamu dan Area Belajar': {
    icon: Sofa,
    description: 'Ruang untuk menerima tamu hingga pukul 21.00 WIB dan belajar bersama.',
  },
  'Parkir Motor Berkanopi': {
    icon: Bike,
    description: 'Area parkir motor beratap di dalam lingkungan kos.',
  },
  'CCTV 24 Jam': {
    icon: Camera,
    description: 'Pemantauan area masuk dan koridor bersama sepanjang hari.',
  },
  'Area Jemur Tertutup': {
    icon: Shirt,
    description: 'Area menjemur beratap agar pakaian tetap kering saat hujan.',
  },
}

const locationPoints = [
  {
    icon: MapPin,
    title: '5 menit berkendara ke gerbang kampus',
    description: 'Akses cepat ke kawasan kampus tanpa harus melewati jalan utama yang padat.',
  },
  {
    icon: ShoppingBasket,
    title: 'Dekat kebutuhan harian',
    description: 'Minimarket, laundry, apotek, dan rumah makan tersedia di sekitar kos.',
  },
  {
    icon: Lightbulb,
    title: 'Lingkungan perumahan yang tenang',
    description: 'Jalan lingkungan dengan penerangan yang baik dan arus kendaraan rendah.',
  },
  {
    icon: Bike,
    title: 'Mudah dijangkau kendaraan online',
    description: 'Titik jemput ojek online dapat diakses langsung dari depan gang.',
  },
]

function HeroStats({ tersediaCount }) {
  const [ref, inView] = useInView({ threshold: 0.35 })
  const jumlahTersedia = useCountUp(tersediaCount, inView)
  const menitKampus = useCountUp(5, inView)
  const jamKeamanan = useCountUp(24, inView)

  return (
    <dl ref={ref} className="mt-9 grid grid-cols-3 gap-4 border-t border-line pt-6">
      <div>
        <dt className="text-small text-muted">Kamar tersedia</dt>
        <dd className="mt-1 text-[22px] font-bold leading-none tabular text-ink sm:text-[26px] lg:text-[28px]">
          {jumlahTersedia}
        </dd>
      </div>
      <div className="border-l border-line pl-4">
        <dt className="text-small text-muted">Ke kampus</dt>
        <dd className="mt-1 text-[22px] font-bold leading-none tabular text-ink sm:text-[26px] lg:text-[28px]">
          {menitKampus} menit
        </dd>
      </div>
      <div className="border-l border-line pl-4">
        <dt className="text-small text-muted">Keamanan</dt>
        <dd className="mt-1 text-[22px] font-bold leading-none tabular text-ink sm:text-[26px] lg:text-[28px]">
          {jamKeamanan} jam
        </dd>
      </div>
    </dl>
  )
}

export default function HomePage() {
  const profileQuery = usePublicProfile()
  const roomsQuery = usePublicKamar()
  const profilKos = profileQuery.data?.data
  const kamar = roomsQuery.data?.data || []
  const tersedia = kamar.filter((item) => item.status === 'tersedia')
  const unggulan = tersedia.slice(0, 3)
  const heroRoom =
    tersedia.find((item) => item.nomor_kamar === 'B-03') || tersedia[0] || kamar[0]
  const waNumber = profilKos
    ? `62${normalizeWhatsApp(profilKos.no_whatsapp_admin).replace(/^0/, '')}`
    : ''
  const loading = profileQuery.isLoading || roomsQuery.isLoading
  const failed = profileQuery.isError || roomsQuery.isError
  const hargaMulai = kamar.reduce(
    (minimum, item) => Math.min(minimum, Number(item.harga_bulanan)),
    Number.POSITIVE_INFINITY,
  )

  usePageMeta({
    title: 'Kos Putri Nyaman Dekat Kampus di Yogyakarta',
    description:
      'Vitana Residence menyediakan kos putri dengan keamanan 24 jam, fasilitas bersama yang lengkap, dan akses cepat ke kampus di Yogyakarta.',
    image: profilKos?.foto_utama_url,
  })

  if (loading) {
    return (
      <section className="border-b border-line bg-ivory">
        <div className="container-page grid gap-10 pb-8 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch lg:gap-14 lg:pb-8 lg:pt-12">
          <div className="space-y-5" aria-hidden="true">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-4/5" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-12 w-44" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
          <div className="flex flex-col" aria-hidden="true">
            <div className="grid flex-1 gap-3 sm:grid-cols-[1.35fr_1fr]">
              <Skeleton className="aspect-[4/3] w-full rounded-card sm:aspect-auto sm:h-full" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:grid-rows-[1fr_auto]">
                <Skeleton className="aspect-square w-full rounded-card sm:aspect-auto sm:h-full" />
                <Skeleton className="h-full min-h-32 w-full rounded-card" />
              </div>
            </div>
            <Skeleton className="mt-3 h-4 w-2/3" />
          </div>
          <span className="sr-only" role="status">
            Memuat beranda Vitana Residence
          </span>
        </div>
      </section>
    )
  }

  if (failed || !profilKos) {
    return (
      <section className="container-page py-16">
        <ErrorState
          title="Beranda belum dapat dimuat"
          description="Profil kos dan katalog kamar belum dapat diambil dari server. Periksa koneksi lalu coba lagi."
          onRetry={() => {
            profileQuery.refetch()
            roomsQuery.refetch()
          }}
        />
      </section>
    )
  }

  return (
    <>
      <section className="border-b border-line bg-ivory">
        <div className="container-page grid gap-10 pb-8 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch lg:gap-14 lg:pb-8 lg:pt-12">
          <Reveal className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-brand-600" aria-hidden="true" />
              <p className="text-small font-semibold text-brand-700">Kos putri di Yogyakarta</p>
            </div>
            <h1 className="mt-6 max-w-[17ch] text-[38px] font-bold leading-[1.06] tracking-[-0.03em] text-ink sm:text-[44px] xl:text-[46px]">
              Kos putri yang tenang, dekat kampus, dan siap ditempati.
            </h1>
            <p className="mt-6 max-w-prose text-[17px] leading-relaxed text-muted">
              {profilKos.deskripsi}
            </p>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row">
              <Link to="/kamar" className={buttonStyles({ variant: 'primary', size: 'lg', className: 'min-h-[50px] px-6' })}>
                Lihat kamar tersedia
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/cek-pengajuan"
                className={buttonStyles({ variant: 'secondary', size: 'lg', className: 'min-h-[50px] px-6' })}
              >
                Cek status pengajuan
              </Link>
            </div>
            <HeroStats tersediaCount={tersedia.length} />
          </Reveal>

          <div className="relative flex min-w-0 flex-col">
            <div className="grid flex-1 gap-3 sm:grid-cols-[1.35fr_1fr]">
              <figure className="relative aspect-[4/3] overflow-hidden rounded-card border border-line bg-brand-50 sm:aspect-auto sm:h-full">
                <ParallaxImage
                  src={heroRoom?.foto_utama_url || profilKos.foto_utama_url}
                  alt={
                    heroRoom
                      ? `Foto kamar ${heroRoom.nomor_kamar} tipe ${heroRoom.nama_tipe}`
                      : 'Kamar di Vitana Residence'
                  }
                  width="1200"
                  height="800"
                  fetchpriority="high"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/95 px-2.5 py-1.5 text-small font-semibold text-ink">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      tersedia.length > 0 ? 'bg-success' : 'bg-warning'
                    }`}
                    aria-hidden="true"
                  />
                  {tersedia.length > 0
                    ? `${tersedia.length} kamar tersedia`
                    : 'Kamar sedang penuh'}
                </span>
              </figure>

              <Reveal
                delay={140}
                className="grid h-full grid-cols-2 gap-3 sm:grid-cols-1 sm:grid-rows-[1fr_auto]"
              >
                <figure className="overflow-hidden rounded-card border border-line bg-brand-50">
                  <img
                    src={profilKos.foto_utama_url || heroRoom?.foto_utama_url}
                    alt="Ruang tamu dan area bersama di Vitana Residence"
                    width="600"
                    height="600"
                    loading="lazy"
                    className="aspect-square h-full w-full object-cover sm:aspect-auto sm:h-full"
                  />
                </figure>
                <div className="flex h-full flex-col justify-between rounded-card bg-brand-900 p-4 text-white">
                  <div>
                    <p className="text-small text-brand-200">Mulai dari</p>
                    <p className="mt-1 text-[24px] font-bold leading-none tabular text-white">
                      {Number.isFinite(hargaMulai) ? formatRupiah(hargaMulai) : '-'}
                    </p>
                    <p className="mt-1 text-small text-brand-200">per bulan</p>
                  </div>
                  <p className="mt-4 border-t border-brand-700 pt-3 text-small text-brand-100">
                    Harga sewa paket bulanan
                  </p>
                </div>
              </Reveal>
            </div>
            <p className="mt-3 shrink-0 text-small text-muted">
              {heroRoom
                ? `Ruang tamu bersama dan kamar tipe ${heroRoom.nama_tipe}.`
                : 'Ruang tamu bersama di Vitana Residence.'}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="container-page grid gap-10 pb-16 pt-10 sm:pb-20 sm:pt-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch lg:gap-16">
          <Reveal
            as="figure"
            className="relative min-h-[340px] overflow-hidden rounded-card border border-line bg-brand-50"
          >
            <ParallaxImage
              src="/images/area-belajar.jpg"
              alt="Ruang tamu dan area belajar dengan meja panjang"
              width="1200"
              height="1000"
              loading="lazy"
              strength={0.02}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-4 bottom-4 rounded-card border border-line bg-white/95 p-4">
              <p className="flex gap-2.5 text-small leading-relaxed text-ink">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                {profilKos.alamat}
              </p>
              <a
                href={profilKos.link_maps}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex min-h-[44px] items-center text-small font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-900"
              >
                Buka di Google Maps
              </a>
            </figcaption>
          </Reveal>

          <div>
            <Reveal>
              <SectionLabel index="01">Lokasi dan akses</SectionLabel>
              <h2 className="mt-4 max-w-[22ch] text-[24px] font-bold leading-snug tracking-tight text-ink">
                Dekat kampus, tetap tenang untuk beristirahat.
              </h2>
              <p className="mt-4 max-w-prose text-[17px] leading-relaxed text-muted">
                Vitana Residence berada di kawasan Depok, Sleman. Penghuni dapat mencapai kampus
                dengan cepat, sementara lingkungan kos tetap nyaman untuk belajar dan beristirahat.
              </p>
            </Reveal>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {locationPoints.map((point, index) => {
                const Icon = point.icon
                return (
                  <Reveal
                    as="li"
                    key={point.title}
                    delay={index * 70}
                    className="flex gap-4 py-4"
                  >
                    <Icon className="mt-1 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
                    <div className="min-w-0">
                      <h3 className="text-h3 text-ink">{point.title}</h3>
                      <p className="mt-1 max-w-prose text-small leading-relaxed text-muted">
                        {point.description}
                      </p>
                    </div>
                  </Reveal>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-brand-50/50">
        <div className="container-page py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <Reveal>
                <SectionLabel index="02">Fasilitas bersama</SectionLabel>
                <h2 className="mt-4 max-w-[22ch] text-[24px] font-bold leading-snug tracking-tight text-ink">
                  Fasilitas yang menunjang kegiatan sehari-hari.
                </h2>
                <p className="mt-4 max-w-prose text-[17px] leading-relaxed text-muted">
                  Seluruh fasilitas dapat digunakan bersama oleh penghuni dengan aturan kebersihan
                  dan keamanan yang disepakati.
                </p>
              </Reveal>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Reveal
                  as="figure"
                  className="overflow-hidden rounded-card border border-line bg-white"
                >
                  <img
                    src="/images/dapur-bersama.jpg"
                    alt="Dapur bersama dengan meja dan peralatan memasak"
                    width="900"
                    height="1125"
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <figcaption className="border-t border-line px-3 py-2 text-small font-medium text-muted">
                    Dapur bersama
                  </figcaption>
                </Reveal>
                <Reveal
                  as="figure"
                  delay={100}
                  className="mt-8 overflow-hidden rounded-card border border-line bg-white"
                >
                  <img
                    src="/images/kamar-baru-4.jpg"
                    alt="Suasana kamar dengan tempat tidur dan sofa"
                    width="900"
                    height="1125"
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <figcaption className="border-t border-line px-3 py-2 text-small font-medium text-muted">
                    Suasana kamar
                  </figcaption>
                </Reveal>
              </div>
            </div>

            <ul className="grid gap-x-8 sm:grid-cols-2">
              {profilKos.fasilitas_umum.map((fasilitas, index) => {
                const detail = facilityDetails[fasilitas] || {
                  icon: Check,
                  description: 'Tersedia untuk seluruh penghuni Vitana Residence.',
                }
                const Icon = detail.icon
                return (
                  <Reveal
                    as="li"
                    key={fasilitas}
                    delay={index * 55}
                    className="border-t border-brand-100 py-4"
                  >
                    <Icon className="h-5 w-5 text-brand-700" aria-hidden="true" />
                    <h3 className="mt-2 text-h3 text-ink">{fasilitas}</h3>
                    <p className="mt-1 max-w-prose text-small leading-relaxed text-muted">
                      {detail.description}
                    </p>
                  </Reveal>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-brand-900 text-white">
        <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <SectionLabel index="03" tone="light">
              Tata tertib
            </SectionLabel>
            <h2 className="mt-4 max-w-[18ch] text-[24px] font-bold leading-snug tracking-tight text-white">
              Aturan sederhana untuk kenyamanan bersama.
            </h2>
            <p className="mt-4 max-w-prose text-small leading-relaxed text-brand-200">
              Tata tertib berlaku untuk seluruh penghuni dan tamu di lingkungan Vitana Residence.
            </p>
          </Reveal>
          <ol className="divide-y divide-brand-700 border-y border-brand-700">
            {profilKos.tata_tertib.map((aturan, index) => (
              <Reveal
                as="li"
                key={aturan}
                delay={index * 80}
                className="flex gap-5 py-5"
              >
                <span className="text-h3 font-bold tabular text-brand-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="max-w-prose text-body leading-relaxed text-white">{aturan}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <Reveal className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel index="04">Kamar unggulan</SectionLabel>
            <h2 className="mt-4 text-[24px] font-bold leading-snug tracking-tight text-ink">
              Kamar yang tersedia saat ini.
            </h2>
            <p className="mt-2 max-w-prose text-small leading-relaxed text-muted">
              Pilihan kamar dengan foto dan harga terbaru dari Vitana Residence.
            </p>
          </div>
          <Link
            to="/kamar"
            className="inline-flex min-h-[44px] items-center text-small font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-900"
          >
            Lihat semua kamar
          </Link>
        </Reveal>
        {unggulan.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {unggulan.map((item, index) => (
              <Reveal key={item.id} delay={index * 90} className="h-full">
                <RoomCard kamar={item} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-8"
            title="Belum ada kamar yang tersedia"
            description="Semua kamar sedang ditempati atau dalam perawatan. Hubungi Admin untuk menanyakan jadwal ketersediaan berikutnya."
            action={
              <a href={`https://wa.me/${waNumber}`} className={buttonStyles({ variant: 'secondary', className: 'min-h-[48px] text-[15px]' })}>
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Hubungi Admin
              </a>
            }
          />
        )}
      </section>

      <section className="container-page pb-14 sm:pb-20">
        <Reveal className="grid overflow-hidden rounded-card border border-line bg-white lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-10">
            <SectionLabel index="05">Kunjungan dan kontak</SectionLabel>
            <h2 className="mt-4 max-w-[20ch] text-[24px] font-bold leading-snug tracking-tight text-ink">
              Ingin melihat kamar langsung?
            </h2>
            <p className="mt-4 max-w-prose text-[17px] leading-relaxed text-muted">
              Hubungi Admin untuk menjadwalkan kunjungan, menanyakan ketersediaan kamar, atau
              meminta informasi tata cara pengajuan sewa.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles({ variant: 'primary', className: 'min-h-[48px] text-[15px]' })}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Hubungi lewat WhatsApp
              </a>
              <a
                href={profilKos.link_maps}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles({ variant: 'secondary', className: 'min-h-[48px] text-[15px]' })}
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Lihat lokasi
              </a>
            </div>

            <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-2 text-small font-semibold text-muted">
                  <MapPin className="h-4 w-4 text-brand-700" aria-hidden="true" />
                  Alamat
                </dt>
                <dd className="mt-1 max-w-prose text-small leading-relaxed text-ink">
                  {profilKos.alamat}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-small font-semibold text-muted">
                  <Phone className="h-4 w-4 text-brand-700" aria-hidden="true" />
                  WhatsApp Admin
                </dt>
                <dd className="mt-1 text-small tabular text-ink">{profilKos.no_whatsapp_admin}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-small font-semibold text-muted">
                  <Mail className="h-4 w-4 text-brand-700" aria-hidden="true" />
                  Email
                </dt>
                <dd className="mt-1 break-all text-small text-ink">{profilKos.email_admin}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-small font-semibold text-muted">
                  <Clock className="h-4 w-4 text-brand-700" aria-hidden="true" />
                  Jam operasional
                </dt>
                <dd className="mt-1 text-small text-ink">{jamOperasional}</dd>
              </div>
            </dl>
          </div>
          <figure className="relative min-h-[320px] bg-brand-50">
            <ParallaxImage
              src="/images/kamar-baru-4.jpg"
              alt="Kamar Deluxe AC di Vitana Residence"
              width="1200"
              height="1000"
              loading="lazy"
              strength={0.02}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-4 bottom-4 rounded-btn border border-white/40 bg-white/95 px-3 py-2 text-small font-medium text-ink">
              Kamar Deluxe AC di Vitana Residence
            </figcaption>
          </figure>
        </Reveal>
      </section>
    </>
  )
}
