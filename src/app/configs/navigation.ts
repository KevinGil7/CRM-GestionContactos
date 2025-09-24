// src/config/navigation.ts
import { HomeIcon, UsersIcon, BuildingOffice2Icon, Cog6ToothIcon    } from '@heroicons/react/24/outline';
import { FileDown, HandCoins, HandshakeIcon, PiggyBank, ChartNoAxesCombined    } from "lucide-react";

export const navigation = [
  { name: 'Home', href: '/home', icon: HomeIcon, current: true, roles: ['User', 'Admin'] },
  { name: 'Clientes', href: '/home/clientes', icon: UsersIcon, current: false, roles: ['User', 'Admin'] },
  { name: 'Empresa', href: '/home/empresas', icon: BuildingOffice2Icon, current: false, roles: ['User', 'Admin'] },
 
  {
    name: 'Administración',
    icon: Cog6ToothIcon,
    roles: ['Admin'],
    children: [
      { name: 'Usuarios', href: '/home/admin/usuarios' },
    ],
  },
];
