// src/hooks/baseResourceHooks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Crea un conjunto de hooks CRUD genéricos usando React Query.
 *
 * @param {string} key - clave de consulta (e.g. 'users')
 * @param {object} api - objeto con las funciones: fetchAll, fetchOne, create, update, remove
 * @returns {object} hooks: useList, useItem, useCreate, useUpdate, useDelete
 */
export function createResourceHooks(key, api) {
  const useList = () => useQuery([key], api.fetchAll);

  const useItem = (id) =>
    useQuery([key, id], () => api.fetchOne(id), { enabled: !!id });

  const useCreate = () => {
    const qc = useQueryClient();
    return useMutation(api.create, {
      onSuccess: () => qc.invalidateQueries([key]),
    });
  };

  const useUpdate = () => {
    const qc = useQueryClient();
    return useMutation(({ id, data }) => api.update(id, data), {
      onSuccess: (updated) => {
        qc.invalidateQueries([key]);
        qc.invalidateQueries([key, updated.id]);
      },
    });
  };

  const useDelete = () => {
    const qc = useQueryClient();
    return useMutation(api.remove, {
      onSuccess: () => qc.invalidateQueries([key]),
    });
  };

  return { useList, useItem, useCreate, useUpdate, useDelete };
}
