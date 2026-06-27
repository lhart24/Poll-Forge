
//async function thirtysecs () {
        //setInterval(() => {
            //result: string = input
        //}, 30_000); 
    //}

export async function handleInput(input: string): Promise<string> {
    const res = await fetch(input);
    const data = await res.json();
    return JSON.stringify(data);
}
