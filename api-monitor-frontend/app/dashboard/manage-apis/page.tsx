"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle, Network, Pencil } from "lucide-react";
import { API_BASE } from "@/lib/api";

// Authenticated fetch wrapper
const apiFetch = async (url: string, method = "GET", body?: any) => {
  const token = Cookies.get("token");

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔥 Add token
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
};

export default function ManageApis() {
  const [apis, setApis] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState("ALL");

  const [formData, setFormData] = useState({
    name: "",
    endpoint: "",
    method: "GET",
    frequency: "5",
  });

  const [editingApi, setEditingApi] = useState<any>(null);

  // LOAD API LIST
  const loadApis = async () => {
    try {
      const data = await apiFetch(`${API_BASE}/apis`);

      if (Array.isArray(data)) setApis(data);
      else setApis([]);
    } catch (e) {
      console.error("Error loading APIs", e);
    }
  };

  useEffect(() => {
    loadApis();
  }, []);

  // FORM HANDLERS
  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // CREATE API
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      url: formData.endpoint,
      method: formData.method,
      frequency: Number(formData.frequency),
    };

    try {
      const result = await apiFetch(`${API_BASE}/register`, "POST", payload);

      if (result.status === "success") {
        setFormData({ name: "", endpoint: "", method: "GET", frequency: "5" });
        loadApis();
      }
    } catch {
      alert("Backend connection failed");
    }

    setLoading(false);
  };

  // DELETE API
  const deleteApi = async (id: string) => {
    if (!confirm("Delete this API?")) return;

    try {
      await apiFetch(`${API_BASE}/apis/${id}`, "DELETE");
      loadApis();
    } catch {
      alert("Delete error");
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (api: any) => {
    setEditingApi(api);
    setFormData({
      name: api.name,
      endpoint: api.url,
      method: api.method,
      frequency: api.frequency ?? "5",
    });
  };

  // UPDATE API
  const updateApi = async () => {
    if (!editingApi) return;

    const payload = {
      name: formData.name,
      url: formData.endpoint,
      method: formData.method,
      frequency: Number(formData.frequency),
    };

    try {
      await apiFetch(`${API_BASE}/apis/${editingApi._id}`, "PUT", payload);
      setEditingApi(null);
      loadApis();
    } catch {
      alert("Update failed");
    }
  };

  // SEARCH + FILTER
  const filteredApis = apis.filter((api) => {
    const matchSearch = api.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchMethod = filterMethod === "ALL" || api.method === filterMethod;
    return matchSearch && matchMethod;
  });

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Add New API */}
      <Card className="rounded-xl shadow-md animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            Register a New API
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Input
              name="name"
              placeholder="API Name"
              onChange={handleChange}
              value={formData.name}
              required
            />

            <Input
              name="endpoint"
              placeholder="https://example.com/health"
              onChange={handleChange}
              value={formData.endpoint}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={formData.method}
                onValueChange={(v) => setFormData({ ...formData, method: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  {["GET", "POST", "PUT", "DELETE"].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                placeholder="Check interval (sec)"
              />
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? "Adding..." : "Add API"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <Card className="rounded-xl shadow-md animate-slide-up delay-100">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-600" />
            Manage Your APIs
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search API name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select
              value={filterMethod}
              onValueChange={(v) => setFilterMethod(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Methods</SelectItem>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredApis.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No matching APIs found.
            </p>
          ) : (
            <ul className="space-y-3">
              {filteredApis.map((api) => (
                <li
                  key={api._id}
                  className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <div>
                    <p className="font-semibold">{api.name}</p>
                    <p className="text-xs text-muted-foreground">{api.url}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded text-xs bg-gray-100 dark:bg-gray-800">
                      {api.method}
                    </span>

                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => openEditModal(api)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteApi(api._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* EDIT MODAL */}
      <Dialog open={!!editingApi} onOpenChange={() => setEditingApi(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              name="name"
              value={formData.name}
              placeholder="API Name"
              onChange={handleChange}
            />

            <Input
              name="endpoint"
              value={formData.endpoint}
              placeholder="API Endpoint"
              onChange={handleChange}
            />

            <Select
              value={formData.method}
              onValueChange={(v) => setFormData({ ...formData, method: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              name="frequency"
              value={formData.frequency}
              placeholder="Interval (sec)"
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditingApi(null)}>
              Cancel
            </Button>
            <Button onClick={updateApi}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
