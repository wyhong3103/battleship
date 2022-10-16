import Ship from "../ship";

test("Able to retrieve the length / head/ isHorizontal", () => {
    const ship = Ship(4, [0,0], true);
    expect(ship.shipLength).toBe(4);
    expect(ship.getHead()).toEqual([0,0]);
    expect(ship.getHor()).toBe(true);
});

test("Able to change the head/ isHorizontal", () => {
    const ship = Ship(4, [0,0], true);
    expect(ship.shipLength).toBe(4);
    expect(ship.getHead()).toEqual([0,0]);
    expect(ship.getHor()).toBe(true);

    ship.setHead([1,1]);
    ship.setHor(false);
    expect(ship.getHead()).toEqual([1,1]);
    expect(ship.getHor()).toBe(false);
});

test("A ship with length 1 should sunk with one hit", () => {
    const ship = Ship(1, [0,0], true);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

test("A ship with length 2 shouldn't sunk with one hit", () => {
    const ship = Ship(2, [0,0], true);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
});

test("Random test", () => {
    const length = Math.floor(Math.random() * 100);
    const ship = Ship(length, [0,0], true);
    let hitCount = 0;
    for(let i = 0; i < Math.floor(Math.random() * length); i++){
        ship.hit();
        hitCount += 1;
    }
    expect(ship.isSunk()).toBe(hitCount >= length);
});

