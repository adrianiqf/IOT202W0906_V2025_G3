import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import PrincipalTab from '../tabs/PrincipalTab';
import TraficoTab from '../tabs/TraficoTab';
import DispositivosTab from '../tabs/DispositivosTab';
import UsuariosTab from '../tabs/UsuariosTab';
import SeguridadTab from '../tabs/SeguridadTab';
import { useDashboardContext } from '../../../context/DashboardContext';

const DashboardTabs = () => {
  const { activeTab, setActiveTab } = useDashboardContext();
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-5 w-full mb-6">
        <TabsTrigger value="principal">Principal</TabsTrigger>
        <TabsTrigger value="trafico">Tráfico y Accesos</TabsTrigger>
        <TabsTrigger value="dispositivos">Dispositivos</TabsTrigger>
        <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
        <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
      </TabsList>

      <TabsContent value="principal"><PrincipalTab /></TabsContent>
      <TabsContent value="trafico"><TraficoTab /></TabsContent>
      <TabsContent value="dispositivos"><DispositivosTab /></TabsContent>
      <TabsContent value="usuarios"><UsuariosTab /></TabsContent>
      <TabsContent value="seguridad"><SeguridadTab /></TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;