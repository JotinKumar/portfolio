type HeaderLoginRequestInput = {
  isResolved: boolean
  hasUser: boolean
  pathname: string
  searchParams: string
  hash: string
}

type HeaderLoginRequestResolution = {
  openLogin: boolean
  replacementUrl: string | null
}

export function resolveHeaderLoginRequest({
  isResolved,
  hasUser,
  pathname,
  searchParams,
  hash,
}: HeaderLoginRequestInput): HeaderLoginRequestResolution {
  if (!isResolved) {
    return { openLogin: false, replacementUrl: null }
  }

  const nextSearchParams = new URLSearchParams(searchParams)
  if (!nextSearchParams.getAll("login").includes("1")) {
    return { openLogin: false, replacementUrl: null }
  }

  nextSearchParams.delete("login")
  const nextSearch = nextSearchParams.toString()

  return {
    openLogin: !hasUser,
    replacementUrl: `${pathname}${nextSearch ? `?${nextSearch}` : ""}${hash}`,
  }
}
