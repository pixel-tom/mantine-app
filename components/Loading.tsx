import { Loader } from "@mantine/core";

export default function Loading() {
    return (
        <div className="h-full flex items-center justify-center bg-opacity-75">
            <Loader color="green" type="dots" />
        </div>
    )
}
