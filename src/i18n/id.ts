import { Strings } from './types'

export const id: Strings = {
    app: {
        title: 'Simple Geohealth',
        description:
            'Fasilitas kesehatan di Indonesia di atas peta, dari data terbuka. Tanpa akun, tanpa pelacakan.',
        notice: 'Situs ini bukan layanan darurat, dan datanya bisa tidak lengkap atau usang.',
        roadmapHeading: 'Berikutnya',
        roadmap: {
            facilities:
                'Cari rumah sakit, puskesmas, dan klinik di sekitar suatu tempat',
            nearest: 'Fasilitas terdekat per jenis, beserta jaraknya',
            coverage: 'Fasilitas per 10.000 penduduk, per kabupaten',
            risk: 'Fasilitas di dekat gempa, banjir, dan kabut asap terbaru',
        },
    },
    emergency: {
        label: 'Nomor darurat',
        lead: 'Darurat:',
        general: 'Umum',
        ambulance: 'Ambulans',
    },
    language: {
        label: 'Bahasa',
    },
    nav: {
        label: 'Halaman',
        home: 'Beranda',
    },
    skipToContent: 'Lompat ke konten',
    map: {
        region: 'Peta',
        unavailable:
            'Peta tidak dapat ditampilkan di browser ini (WebGL tidak tersedia).',
        provincesFailed: 'Batas provinsi tidak dapat dimuat.',
    },
    credits: {
        heading: 'Sumber',
        licence: (name) => `Lisensi: ${name}`,
    },
}
