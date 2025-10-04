// src/config/navigation.ts
import { HomeIcon, UsersIcon, BuildingOffice2Icon, Cog6ToothIcon    } from '@heroicons/react/24/outline';
import { FileDown, HandCoins, HandshakeIcon, PiggyBank, ChartNoAxesCombined    } from "lucide-react";

export const navigation = [
  { name: 'Home', href: '/home', icon: HomeIcon, current: true, roles: ['User', 'Administrator'] },
  { name: 'Contactos', href: '/home/contactos', icon: UsersIcon, current: false, roles: ['User', 'Administrator'] },
  { name: 'Clientes', href: '/home/clientes', icon: UsersIcon, current: false, roles: ['User', 'Administrator'] },
  { name: 'Proveedores', href: '/home/proveedores', icon: BuildingOffice2Icon, current: false, roles: ['User', 'Administrator'] },
  { name: 'Interacciones', href: '/home/interaccion', icon: HandshakeIcon, current: false, roles: ['User', 'Administrator'] },
  
 
  {
    name: 'Administración',
    icon: Cog6ToothIcon,
    roles: ['Administrator'],
    children: [
      { name: 'Usuarios', href: '/home/admin/usuarios' },
    ],
  },
];
