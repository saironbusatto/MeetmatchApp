import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AvailabilitySubmitRequest, CreatePrivateEventRequest, CreatePublicEventRequest } from "@farmei/types";
import { useApi } from "./useApi";

export function usePrivateEvents() {
  const api = useApi();
  return useQuery({
    queryKey: ["private-events"],
    queryFn: () => api.privateEvents.list(),
  });
}

export function usePrivateEvent(id: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["private-events", id],
    queryFn: () => api.privateEvents.get(id),
    enabled: !!id,
  });
}

export function usePrivateEventSuggestion(id: string, enabled: boolean) {
  const api = useApi();
  return useQuery({
    queryKey: ["private-events", id, "suggestion"],
    queryFn: () => api.privateEvents.suggestion(id),
    enabled: !!id && enabled,
    retry: false,
  });
}

export function useCreatePrivateEvent() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePrivateEventRequest) => api.privateEvents.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["private-events"] }),
  });
}

export function useUpdatePrivateEvent(id: string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { keyPersonUserId?: string | null; quorumMin?: number }) =>
      api.privateEvents.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["private-events", id] }),
  });
}

export function useConfirmEvent(id: string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.privateEvents.confirm(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["private-events", id] }),
  });
}

export function useDiaDoBolo(id: string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (action: "leave" | "join") => api.privateEvents.diaDoBolo(id, action),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["private-events", id] });
      qc.invalidateQueries({ queryKey: ["private-events", id, "suggestion"] });
    },
  });
}

export function useAvailability(id: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["private-events", id, "availability"],
    queryFn: () => api.privateEvents.availability(id),
    enabled: !!id,
  });
}

export function usePublicEvents(category?: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["public-events", category],
    queryFn: () => api.publicEvents.list(category),
  });
}

export function usePublicEvent(id: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["public-events", id],
    queryFn: () => api.publicEvents.get(id),
    enabled: !!id,
  });
}

export function useCreatePublicEvent() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePublicEventRequest) => api.publicEvents.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["public-events"] }),
  });
}

export function useRegisterPublicEvent(id: string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.publicEvents.register(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["public-events", id] }),
  });
}

export function useUnregisterPublicEvent(id: string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.publicEvents.unregister(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["public-events", id] }),
  });
}

export function useInviteParticipant(eventId: string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string }) => api.privateEvents.invite(eventId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["private-events", eventId] }),
  });
}

export function useSubmitAvailability(eventId: string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AvailabilitySubmitRequest) =>
      api.privateEvents.submitAvailability(eventId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["private-events", eventId] });
      qc.invalidateQueries({ queryKey: ["private-events", eventId, "availability"] });
      qc.invalidateQueries({ queryKey: ["private-events", eventId, "suggestion"] });
    },
  });
}