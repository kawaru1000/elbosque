
import { Staff, Service } from './types';

export const SERVICES: Service[] = [
    { id: 1, name: 'Corte de Pelo', duration: 30, price: 25 },
    { id: 2, name: 'Afeitado Clásico', duration: 45, price: 30 },
    { id: 3, name: 'Masaje Relajante', duration: 60, price: 50 },
    { id: 4, name: 'Manicura', duration: 45, price: 20 },
    { id: 5, name: 'Consulta Nutricional', duration: 60, price: 70 },
    { id: 6, name: 'Sesión de Fisioterapia', duration: 50, price: 60},
];

export const STAFF_MEMBERS: Staff[] = [
    {
        id: 1,
        name: 'Carlos Rivas',
        title: 'Barbero Principal',
        avatarUrl: 'https://picsum.photos/seed/carlos/200',
        services: [1, 2],
    },
    {
        id: 2,
        name: 'Ana Gómez',
        title: 'Masajista y Esteticista',
        avatarUrl: 'https://picsum.photos/seed/ana/200',
        services: [3, 4],
    },
    {
        id: 3,
        name: 'Lucía Fernández',
        title: 'Nutricionista',
        avatarUrl: 'https://picsum.photos/seed/lucia/200',
        services: [5],
    },
     {
        id: 4,
        name: 'Javier Moreno',
        title: 'Fisioterapeuta',
        avatarUrl: 'https://picsum.photos/seed/javier/200',
        services: [6],
    },
];
