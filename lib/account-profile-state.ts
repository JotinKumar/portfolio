export type AccountProfileMetadata = {
  display_name: string
  avatar_url: string
  bio: string
}

export function getAccountProfileMetadata(
  displayName: string,
  avatarUrl: string,
  bio: string,
): AccountProfileMetadata {
  return {
    display_name: displayName,
    avatar_url: avatarUrl,
    bio,
  }
}

export function shouldResetAccountProfile({
  currentUserId,
  nextUserId,
  isDirty,
  metadataChanged,
}: {
  currentUserId: string
  nextUserId: string
  isDirty: boolean
  metadataChanged: boolean
}) {
  return currentUserId !== nextUserId || (metadataChanged && !isDirty)
}
