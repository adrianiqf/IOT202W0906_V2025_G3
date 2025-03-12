// src/hooks/useCarreraDistribution.js

export const useCarreraDistribution = (usuarios) => {
    return React.useMemo(() => {
      const carrerasMap = new Map();
      usuarios.forEach(usuario => {
        if (!carrerasMap.has(usuario.carrera)) {
          carrerasMap.set(usuario.carrera, 0);
        }
        carrerasMap.set(usuario.carrera, carrerasMap.get(usuario.carrera) + 1);
      });
      
      return Array.from(carrerasMap.entries()).map(([carrera, cantidad]) => ({
        carrera,
        cantidad
      }));
    }, [usuarios]);
  };