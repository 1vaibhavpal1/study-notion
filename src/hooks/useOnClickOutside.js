import { useEffect } from "react"

function useOnClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target))
                return;

            handler(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchdown", listener);

        return () => {
            document.removeEventListener("mousedown",listener)
            document.removeEventListener("touchdown", listener)
        };
    },
    [ref,handler]
    );
}
export default useOnClickOutside