'use client';

import { useState } from 'react';
import { useCategories } from '@/lib/hooks/use-categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

function CategoryRow({ id, name, kind, color, onSave, onArchive }:{
  id:string; name:string; kind:'EXPENSE'|'INCOME'; color:string;
  onSave:(d:{name:string;kind:'EXPENSE'|'INCOME';color:string})=>void;
  onArchive:()=>void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftKind, setDraftKind] = useState(kind);
  const [draftColor, setDraftColor] = useState(color);

  return (
    <div className="flex items-center justify-between rounded border p-2">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ background: draftColor }} />
        {editing ? (
          <div className="flex items-center gap-2">
            <Input value={draftName} onChange={(e)=>setDraftName(e.target.value)} className="h-8 w-40" />
            <Select value={draftKind} onChange={(e)=>setDraftKind(e.target.value as any)} className="h-8 w-28">
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </Select>
            <Input type="color" value={draftColor} onChange={(e)=>setDraftColor(e.target.value)} className="h-8 w-12 p-0 border-0" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>{name}</span>
            <span className="text-xs text-muted-foreground">{kind.toLowerCase()}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <Button size="sm" onClick={()=>{ onSave({name:draftName.trim(), kind:draftKind, color:draftColor}); setEditing(false); }}>Save</Button>
            <Button size="sm" variant="ghost" onClick={()=>{ setDraftName(name); setDraftKind(kind); setDraftColor(color); setEditing(false); }}>Cancel</Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={()=>setEditing(true)}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={onArchive}>Archive</Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { categories, createCategory, updateCategory, archiveCategory } = useCategories();
  const [name, setName] = useState('');
  const [kind, setKind] = useState<'EXPENSE'|'INCOME'>('EXPENSE');
  const [color, setColor] = useState('#3b82f6');

  const submit = async () => {
    if (!name.trim()) return;
    await createCategory.mutateAsync({ userId:'local-user', name:name.trim(), kind, color });
    setName('');
  };

  const expense = categories.filter(c => c.kind === 'EXPENSE' && !c.name.startsWith('(archived)'));
  const income = categories.filter(c => c.kind === 'INCOME' && !c.name.startsWith('(archived)'));

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Categories</h1>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Add Category</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-12">
          <Input className="sm:col-span-6" placeholder="Name (e.g., Grocery)" value={name} onChange={(e)=>setName(e.target.value)} />
          <Select className="sm:col-span-3" value={kind} onChange={(e)=>setKind(e.target.value as any)}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </Select>
          <Input className="sm:col-span-2" type="color" value={color} onChange={(e)=>setColor(e.target.value)} />
          <Button className="sm:col-span-1" onClick={submit}>Save</Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Expense</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {expense.map(c => (
              <CategoryRow
                key={c.id}
                id={c.id}
                name={c.name}
                kind={c.kind as any}
                color={c.color}
                onSave={(d)=>updateCategory.mutate({ id:c.id, data:d })}
                onArchive={()=>archiveCategory.mutate(c.id)}
              />
            ))}
            {expense.length === 0 && <div className="text-sm text-muted-foreground">No expense categories yet</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Income</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {income.map(c => (
              <CategoryRow
                key={c.id}
                id={c.id}
                name={c.name}
                kind={c.kind as any}
                color={c.color}
                onSave={(d)=>updateCategory.mutate({ id:c.id, data:d })}
                onArchive={()=>archiveCategory.mutate(c.id)}
              />
            ))}
            {income.length === 0 && <div className="text-sm text-muted-foreground">No income categories yet</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
