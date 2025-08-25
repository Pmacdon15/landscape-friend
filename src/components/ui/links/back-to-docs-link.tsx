import Link from "next/link";
import { Button } from "../button";

export default function BackToDocsLink() {
    return (
        <Link href="/documentation" className="mx-auto mt-auto">
            <Button variant='outline'>
                Back To Documentation
            </Button>
        </Link>
    );
}