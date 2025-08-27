export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  prefetch: () => Promise.resolve(),
});

export const usePathname = () => "/mock-path";
export const useSearchParams = () => new URLSearchParams();
export const notFound = () => {
  throw new Error("notFound() called");
};
