// src/hooks/baseResourceHooks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Crea un conjunto de hooks CRUD genéricos usando React Query.
 *
 * @param {string} key  Clave base para la query (p. ej. "users").
 * @param {object} api  Funciones de la API:
 *   - fetchAll(filters?)            -> Promise
 *   - fetchOne(id)                  -> Promise
 *   - create(data)                  -> Promise
 *   - update(id, data)              -> Promise
 *   - remove(id)                    -> Promise
 *
 * @returns {{ useList, useItem, useCreate, useUpdate, useDelete }}
 */
export function createResourceHooks(key, api) {
  /* ---------- LISTAR (filtros opcionales) ----------------------------- */
  const useList = (filters = {}) =>
    useQuery({
      queryKey: [key, filters], // la queryKey incluye los filtros
      queryFn: () => api.fetchAll(filters),
    });

  /* ---------- OBTENER UNO -------------------------------------------- */
  const useItem = (id) =>
    useQuery({
      queryKey: [key, id],
      queryFn: () => api.fetchOne(id),
      enabled: !!id,
    });

  /* ---------- CREAR --------------------------------------------------- */
  const useCreate = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: api.create,
      onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
    });
  };

  /* ---------- ACTUALIZAR --------------------------------------------- */
  const useUpdate = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }) => api.update(id, data),
      onSuccess: (updated) => {
        qc.invalidateQueries({ queryKey: [key] });
        qc.invalidateQueries({ queryKey: [key, updated.id] });
      },
    });
  };

  /* ---------- ELIMINAR ------------------------------------------------ */
  const useDelete = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: api.remove,
      onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
    });
  };

  return { useList, useItem, useCreate, useUpdate, useDelete };
}
