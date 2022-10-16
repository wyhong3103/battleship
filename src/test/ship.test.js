import Ship from "../ship";

test("Able to retrieve the length", () => {
    const ship = Ship(4);
    expect(ship.shipLength).toBe(4);
});

test("A ship with length 1 should sunk with one hit", () => {
    const ship = Ship(1);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

test("A ship with length 2 shouldn't sunk with one hit", () => {
    const ship = Ship(2);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
});

test("Random test", () => {
    const length = Math.floor(Math.random() * 100);
    const ship = Ship(length);
    let hitCount = 0;
    for(let i = 0; i < Math.floor(Math.random() * length); i++){
        ship.hit();
        hitCount += 1;
    }
    expect(ship.isSunk()).toBe(hitCount >= length);
});

