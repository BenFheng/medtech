import type { Supplement } from "./types";

export function swapCompound(
  stack: Supplement[],
  removeId: string,
  addCompound: Supplement
): { stack: Supplement[]; conflicts: string[] } {
  const conflicts: string[] = [];
  const newStack = stack.filter((s) => s.id !== removeId);

  // Check interactions with remaining stack
  for (const existing of newStack) {
    const antagonism = existing.interactions.antagonisms.find(
      (a) => a.compound === addCompound.id
    );
    const reverseAntagonism = addCompound.interactions.antagonisms.find(
      (a) => a.compound === existing.id
    );

    if (antagonism) {
      conflicts.push(
        `${existing.name} conflicts with ${addCompound.name}: ${antagonism.reason}`
      );
    }
    if (reverseAntagonism) {
      conflicts.push(
        `${addCompound.name} conflicts with ${existing.name}: ${reverseAntagonism.reason}`
      );
    }
  }

  newStack.push(addCompound);
  return { stack: newStack, conflicts };
}

export function recalculatePrice(stack: Supplement[]): number {
  return stack.reduce((sum, s) => sum + s.pricePerMonth, 0);
}

export function checkConflicts(stack: Supplement[]): string[] {
  const conflicts: string[] = [];
  for (let i = 0; i < stack.length; i++) {
    for (let j = i + 1; j < stack.length; j++) {
      const a = stack[i];
      const b = stack[j];
      const aConflict = a.interactions.antagonisms.find(
        (ant) => ant.compound === b.id
      );
      const bConflict = b.interactions.antagonisms.find(
        (ant) => ant.compound === a.id
      );
      if (aConflict) {
        conflicts.push(`${a.name} ↔ ${b.name}: ${aConflict.reason}`);
      } else if (bConflict) {
        conflicts.push(`${b.name} ↔ ${a.name}: ${bConflict.reason}`);
      }
    }
  }
  return conflicts;
}

export function getSynergies(stack: Supplement[]): string[] {
  const synergies: string[] = [];
  for (let i = 0; i < stack.length; i++) {
    for (let j = i + 1; j < stack.length; j++) {
      const a = stack[i];
      const b = stack[j];
      const aSynergy = a.interactions.synergies.find(
        (syn) => syn.compound === b.id
      );
      if (aSynergy) {
        synergies.push(`${a.name} + ${b.name}: ${aSynergy.reason}`);
      }
    }
  }
  return synergies;
}
